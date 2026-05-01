import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Request, HTTPException, status
import jwt
from jwt.exceptions import PyJWTError as JWTError
import bcrypt
from sqlalchemy.orm import Session
import models

SECRET_KEY = "votre_cle_secrete_super_secure_ne_pas_partager"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 semaine

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user_from_cookie(request: Request, db: Session):
    token = request.cookies.get("access_token")
    if not token:
        return None
    
    # Check "Bearer " prefix if necessary, but simple cookie should be just token
    if token.startswith("Bearer "):
        token = token.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None

    user = db.query(models.User).filter(models.User.username == username).first()
    return user

def require_auth(request: Request, db: Session):
    user = get_current_user_from_cookie(request, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Non authentifié"
        )
    return user

def require_admin(request: Request, db: Session):
    user = require_auth(request, db)
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Nécessite les droits administrateur."
        )
    return user

def get_current_customer_from_cookie(request: Request, db: Session):
    token = request.cookies.get("customer_token")
    if not token:
        return None
    
    if token.startswith("Bearer "):
        token = token.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except JWTError:
        return None

    customer = db.query(models.Customer).filter(models.Customer.email == email).first()
    return customer

def require_customer(request: Request, db: Session):
    customer = get_current_customer_from_cookie(request, db)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Client non authentifié"
        )
    return customer
