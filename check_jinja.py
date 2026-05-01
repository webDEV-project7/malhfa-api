from jinja2 import Environment, FileSystemLoader
try:
    env = Environment(loader=FileSystemLoader('templates'))
    env.get_template('index.html')
    print("index.html is valid Jinja")
except Exception as e:
    print("Error parsing index.html:", str(e))
