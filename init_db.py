from database import engine, SessionLocal
import models
import auth

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()
if not db.query(models.User).filter(models.User.username == "admin").first():
    db.add(models.User(username="admin", hashed_password=auth.get_password_hash("admin"), role="admin"))
if not db.query(models.User).filter(models.User.username == "produit").first():
    db.add(models.User(username="produit", hashed_password=auth.get_password_hash("produit"), role="produit"))
if not db.query(models.User).filter(models.User.username == "charge").first():
    db.add(models.User(username="charge", hashed_password=auth.get_password_hash("charge"), role="charge"))
db.commit()
db.close()
print("Init DB OK !")