#!/usr/bin/env python3
"""Apply schema.sql to Aurora via the RDS Data API (no bastion required)."""

import json
import re
import subprocess
import sys
from pathlib import Path


def tofu_output(key: str) -> str:
    result = subprocess.run(
        ["tofu", "-chdir=infra", "output", "-raw", key],
        capture_output=True, text=True, check=True,
    )
    return result.stdout.strip()


def run_sql(cluster_arn: str, secret_arn: str, db_name: str, sql: str) -> None:
    result = subprocess.run(
        [
            "aws", "rds-data", "execute-statement",
            "--region", "ap-southeast-2",
            "--resource-arn", cluster_arn,
            "--secret-arn", secret_arn,
            "--database", db_name,
            "--sql", sql,
        ],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        # Surface the error but keep going — idempotent schema may hit harmless errors
        print(f"  WARNING: {result.stderr.strip()}", file=sys.stderr)
    else:
        print("  OK")


def parse_statements(sql: str) -> list[str]:
    # Strip single-line comments
    sql = re.sub(r"--[^\n]*", "", sql)
    # Split on semicolons, drop blanks
    return [s.strip() for s in sql.split(";") if s.strip()]


def main() -> None:
    print("==> Reading tofu outputs...")
    cluster_arn = tofu_output("rds_cluster_arn")
    secret_arn = tofu_output("db_secret_arn")
    db_name = tofu_output("db_name")

    schema_path = Path(__file__).parent.parent / "schema.sql"
    statements = parse_statements(schema_path.read_text())

    print(f"==> Applying {len(statements)} SQL statements to '{db_name}'...")
    for i, stmt in enumerate(statements, 1):
        preview = stmt[:70].replace("\n", " ")
        print(f"  [{i}/{len(statements)}] {preview}...")
        run_sql(cluster_arn, secret_arn, db_name, stmt)

    print("==> Schema applied.")


if __name__ == "__main__":
    main()
