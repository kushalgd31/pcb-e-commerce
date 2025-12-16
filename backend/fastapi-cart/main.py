from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pydantic import BaseModel
from datetime import datetime
from jose import jwt, JWTError

app = FastAPI()

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client.cart_db
carts = db.carts
activity_logs = db.activity_logs

# JWT settings (same as Django)
SECRET_KEY = "django-insecure-n&4k57_9#-1b05m+osbwy%5&e2bwnl8j2n3x+#1m2#4y931y+)"  # Use the same secret from Django settings
ALGORITHM = "HS256"

bearer = HTTPBearer()

class CartItem(BaseModel):
    product_id: int
    qty: int

class CartUpdate(BaseModel):
    items: list[CartItem]

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = str(payload.get("user_id"))
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/cart")
def get_cart(user_id: str = Depends(get_current_user)):
    cart = carts.find_one({"user_id": user_id})
    if not cart:
        return {"user_id": user_id, "items": [], "updated_at": datetime.utcnow()}
    return cart

@app.post("/cart/add")
def add_to_cart(item: CartItem, user_id: str = Depends(get_current_user)):
    cart = carts.find_one({"user_id": user_id})
    if not cart:
        cart = {"user_id": user_id, "items": [item.dict()], "updated_at": datetime.utcnow()}
        carts.insert_one(cart)
    else:
        found = False
        for i in cart["items"]:
            if i["product_id"] == item.product_id:
                i["qty"] += item.qty
                found = True
                break
        if not found:
            cart["items"].append(item.dict())
        cart["updated_at"] = datetime.utcnow()
        carts.replace_one({"user_id": user_id}, cart)
    return {"message": "Added to cart"}

@app.put("/cart/update")
def update_cart(update: CartUpdate, user_id: str = Depends(get_current_user)):
    cart = {"user_id": user_id, "items": [item.dict() for item in update.items], "updated_at": datetime.utcnow()}
    carts.replace_one({"user_id": user_id}, cart, upsert=True)
    return {"message": "Cart updated"}

@app.delete("/cart/remove")
def remove_from_cart(product_id: int, user_id: str = Depends(get_current_user)):
    cart = carts.find_one({"user_id": user_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    cart["items"] = [i for i in cart["items"] if i["product_id"] != product_id]
    cart["updated_at"] = datetime.utcnow()
    carts.replace_one({"user_id": user_id}, cart)
    return {"message": "Item removed"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)