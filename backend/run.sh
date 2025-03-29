# load .env env variables
export $(grep -v '^#' .env | xargs)
# run the script

# run with uvicorn main.py (app)
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
