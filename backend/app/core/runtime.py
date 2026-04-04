"""Runtime configuration helpers for local development stability."""

from __future__ import annotations

import os


def configure_runtime_environment() -> None:
    """Set conservative defaults that reduce multiprocessing side effects."""
    os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
    os.environ.setdefault("OMP_NUM_THREADS", "1")
    os.environ.setdefault("MKL_NUM_THREADS", "1")
