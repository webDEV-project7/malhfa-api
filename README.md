# Gestionnaire Financier (Produits, Charges et Bénéfices)

## Description
Une application web complète pour le calcul et le suivi des produits, charges et bénéfices. L'application permet :
- D'importer des fichiers Excel via Drag-and-Drop pour calculer instantanément les résultats.
- De saisir manuellement des données et de voir les calculs s'effectuer en temps réel.
- D'analyser les données mondiales de l'entreprise via un tableau de bord interactif comprenant des KPI et des graphiques.
- De télécharger les historiques et les modèles Excel de saisie.

## Stack Technique
- **Backend** : Python avec FastAPI (haute performance, validation de données avec Pydantic).
- **Base de Données** : MySQL (ORM SQLAlchemy).
- **Frontend** : HTML5, CSS3 Moderne (Glassmorphism), Vanilla JavaScript, Chart.js.
- **Manipulation données** : Pandas et OpenPyXL.

## Lancer le projet
1. Assurez-vous que votre serveur MySQL fonctionne (XAMPP / WAMP) et créez une base de données `gestion_financiere`.
2. Activez l'environnement virtuel.
3. Lancez le serveur avec : `uvicorn main:app --reload`
4. Accédez à l'application via [http://localhost:8000](http://localhost:8000).
