from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# 1. Define the path to the existing Vector Database
vector_db_path = "D:\llm project\Vector_Database"

# 2. Load the same Embedding Model used previously
print("Loading the embedding model...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 3. Load the saved Vector Database from the local directory
print("Loading the ChromaDB vector store...")
vector_db = Chroma(persist_directory=vector_db_path, embedding_function=embeddings)

# 4. Set up the Retriever (Configured to return the top 3 most relevant chunks)
retriever = vector_db.as_retriever(search_kwargs={"k": 3})

# 5. Define a sample legal question
user_query = "Can I submit an affidavit in the Sinhala language?"
print(f"\nUser Query: {user_query}\n")

# 6. Perform the Semantic Search to find relevant documents
print("Searching the database for relevant legal information...\n")
retrieved_docs = retriever.invoke(user_query)

# 7. Display the retrieved results
for i, doc in enumerate(retrieved_docs):
    print(f"--- Result {i + 1} ---")
    print(doc.page_content)
    print(f"Source: {doc.metadata}\n")