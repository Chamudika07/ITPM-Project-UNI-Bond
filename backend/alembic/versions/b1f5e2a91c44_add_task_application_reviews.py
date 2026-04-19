"""add task application reviews

Revision ID: b1f5e2a91c44
Revises: 39d8826b4a43
Create Date: 2026-04-19 18:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b1f5e2a91c44"
down_revision: Union[str, Sequence[str], None] = "39d8826b4a43"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("task_applicants", sa.Column("status", sa.String(length=50), nullable=False, server_default="pending"))
    op.add_column("task_applicants", sa.Column("email", sa.String(length=255), nullable=True))
    op.add_column("task_applicants", sa.Column("portfolio_url", sa.String(length=500), nullable=True))
    op.add_column("task_applicants", sa.Column("cover_letter", sa.Text(), nullable=True))
    op.add_column("task_applicants", sa.Column("submission_url", sa.String(length=500), nullable=True))
    op.add_column("task_applicants", sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("task_applicants", sa.Column("company_rating", sa.Integer(), nullable=True))
    op.add_column("task_applicants", sa.Column("company_feedback", sa.Text(), nullable=True))
    op.add_column("task_applicants", sa.Column("rated_at", sa.DateTime(timezone=True), nullable=True))

    op.execute("UPDATE task_applicants SET status = 'pending' WHERE status IS NULL")
    op.alter_column("task_applicants", "status", server_default=None)


def downgrade() -> None:
    op.drop_column("task_applicants", "rated_at")
    op.drop_column("task_applicants", "company_feedback")
    op.drop_column("task_applicants", "company_rating")
    op.drop_column("task_applicants", "submitted_at")
    op.drop_column("task_applicants", "submission_url")
    op.drop_column("task_applicants", "cover_letter")
    op.drop_column("task_applicants", "portfolio_url")
    op.drop_column("task_applicants", "email")
    op.drop_column("task_applicants", "status")
