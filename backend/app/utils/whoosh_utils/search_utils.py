from whoosh.index import open_dir
from whoosh.qparser import MultifieldParser

INDEX_DIR = "indexdir"


def search_jobs(keyword):
    ix = open_dir(INDEX_DIR)
    parser = MultifieldParser(["title", "company_name", "tags"], schema=ix.schema)
    query = parser.parse(keyword)

    ids = []
    with ix.searcher() as searcher:
        results = searcher.search(query, limit=None)
        for r in results:
            ids.append(r["id"])  # lấy field job_id
    print(ids)
    return ids
