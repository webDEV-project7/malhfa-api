from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EntryBase(BaseModel):
    entry_type: str
    designation: str
    quantite: float
    prix_unitaire: float
    type_charge: Optional[str] = None

class EntryCreate(EntryBase):
    pass

class EntryResponse(EntryBase):
    id: int
    prix_total: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class InvoiceItem(BaseModel):
    designation: str
    type_commande: str
    quantite: float
    prix_unitaire: float

class InvoiceRequest(BaseModel):
    client_name: str
    client_ice: Optional[str] = ""
    client_address: Optional[str] = ""
    client_phone: Optional[str] = ""
    items: list[InvoiceItem]

class CheckoutItem(BaseModel):
    designation: str
    quantite: float
    prix_unitaire: float

class CheckoutRequest(BaseModel):
    client_name: str
    client_ice: Optional[str] = ""
    client_address: Optional[str] = ""
    client_phone: Optional[str] = ""
    items: list[CheckoutItem]

class UserCreate(BaseModel):
    username: str
    password: str
    role: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    stock: int = 0
    category: str = "Collection"

class ProductCreate(ProductBase):
    pass

class ProductImageSchema(BaseModel):
    id: int
    image_url: str

    class Config:
        from_attributes = True

class ProductResponse(ProductBase):
    id: int
    image_url: Optional[str] = None # Main image
    video_url: Optional[str] = None
    created_at: datetime
    images: List[ProductImageSchema] = []

    class Config:
        from_attributes = True

class OrderItemSchema(BaseModel):
    product_id: Optional[int] = None
    designation: str
    quantite: float
    prix_unitaire: float
    prix_total: float

class OrderCreate(BaseModel):
    client_name: str
    client_phone: Optional[str] = None
    client_address: Optional[str] = None
    client_ice: Optional[str] = None
    payment_method: str
    subtotal: float
    tax: float = 0.0
    discount: float = 0.0
    total: float
    customer_id: Optional[int] = None
    items: List[OrderItemSchema]

class OrderResponse(OrderCreate):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class CustomerRegister(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerLogin(BaseModel):
    email: str
    password: str

class CustomerResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str
