# load .env env variables
export $(grep -v '^#' .env | xargs)
# run the script

# run with uvicorn main.py (app)
uv run uvicorn main:app --host localhost --port 8001 --reload
