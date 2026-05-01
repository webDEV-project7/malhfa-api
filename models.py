from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone

class Entry(Base):
    __tablename__ = "entries"

    id = Column(Integer, primary_key=True, index=True)
    entry_type = Column(String(50), index=True) # "produit" ou "charge"
    designation = Column(String(255))
    quantite = Column(Float)
    prix_unitaire = Column(Float)
    prix_total = Column(Float)
    type_charge = Column(String(255), nullable=True) # Ex: "Transport", "Douane", etc.
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50)) # 'admin', 'produit', 'charge', 'client'

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(String(1000), nullable=True)
    price = Column(Float)
    discount_price = Column(Float, nullable=True)
    stock = Column(Integer, default=0)
    category = Column(String(100), default="Collection") # "Nouvelle", "Luxe", etc.
    image_url = Column(String(255), nullable=True) # Main image
    video_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")

class ProductImage(Base):
    __tablename__ = "product_images"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    image_url = Column(String(255))
    
    product = relationship("Product", back_populates="images")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(255))
    client_phone = Column(String(50), nullable=True)
    client_address = Column(String(500), nullable=True)
    client_ice = Column(String(50), nullable=True)
    payment_method = Column(String(50)) # "Carte" ou "Cash"
    subtotal = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    status = Column(String(50), default="En attente") # En attente, Payée, Expédiée
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    designation = Column(String(255))
    quantite = Column(Float)
    prix_unitaire = Column(Float)
    prix_total = Column(Float)

    order = relationship("Order", back_populates="items")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    full_name = Column(String(255))
    phone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
