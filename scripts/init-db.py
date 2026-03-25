#!/usr/bin/env python3
"""Apply schema.sql to RDS PostgreSQL directly via psycopg2."""

import re
import subprocess
import sys
from pathlib import Path

import psycopg2


def ssm_get(name: str) -> str:
    result = subprocess.run(
        ["aws", "ssm", "get-parameter", "--name", name,
         "--region", "ap-southeast-2", "--query", "Parameter.Value", "--output", "text"],
        capture_output=True, text=True, check=True,
    )
    return result.stdout.strip()


def parse_statements(sql: str) -> list[str]:
    sql = re.sub(r"--[^\n]*", "", sql)
    return [s.strip() for s in sql.split(";") if s.strip()]


def main() -> None:
    print("==> Reading DB credentials from SSM...")
    host = ssm_get("/uniwatch/DB_HOST")
    port = int(ssm_get("/uniwatch/DB_PORT"))
    dbname = ssm_get("/uniwatch/DB_NAME")
    user = ssm_get("/uniwatch/DB_USER")
    password = ssm_get("/uniwatch/DB_PASS")

    print(f"==> Connecting to {host}:{port}/{dbname}...")
    conn = psycopg2.connect(
        host=host, port=port, dbname=dbname,
        user=user, password=password,
        sslmode="require",
    )
    conn.autocommit = True

    schema_path = Path(__file__).parent.parent / "schema.sql"
    statements = parse_statements(schema_path.read_text())

    print(f"==> Applying {len(statements)} SQL statements...")
    cur = conn.cursor()
    for i, stmt in enumerate(statements, 1):
        preview = stmt[:70].replace("\n", " ")
        print(f"  [{i}/{len(statements)}] {preview}...")
        try:
            cur.execute(stmt)
            print("  OK")
        except Exception as e:
            print(f"  WARNING: {e}", file=sys.stderr)

    cur.close()
    conn.close()
    print("==> Schema applied.")


if __name__ == "__main__":
    main()
