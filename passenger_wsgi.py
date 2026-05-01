import os
import sys

os.environ['OPENBLAS_NUM_THREADS'] = '1'
os.environ['OMP_NUM_THREADS'] = '1'
os.environ['MKL_NUM_THREADS'] = '1'
os.environ['NUMEXPR_NUM_THREADS'] = '1'

sys.path.insert(0, '/home/malhfama/malhfa_prod')

from a2wsgi import ASGIMiddleware
from main import app

application = ASGIMiddleware(app)
