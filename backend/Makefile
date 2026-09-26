.PHONY: dev test eval index deploy

dev:
	uv run uvicorn app.main:app --reload --port 8000

test:
	uv run pytest -q

eval:
	uv run evals/run.py

index:
	uv run scripts/build_index.py

deploy:
	fly deploy
