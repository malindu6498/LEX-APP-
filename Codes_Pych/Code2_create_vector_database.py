import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# 1. Define the data directory
data_directory = r"D:\llm project\txt data"

# 2. Load all text files simultaneously
print("Loading files...")
# Autodetect encoding is necessary to prevent errors with special/Sinhala characters
loader = DirectoryLoader(
    data_directory,
    glob="**/*.txt",
    loader_cls=TextLoader,
    loader_kwargs={'autodetect_encoding': True}
)
documents = loader.load()
print(f"Total number of documents: {len(documents)}")

# 3. Initialize the Text Splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    separators=["\n\n", "\n", " ", ""]
)

# 4. Split documents into smaller chunks
print("Splitting data into smaller chunks...")
chunks = text_splitter.split_documents(documents)

print(f"Total number of chunks created: {len(chunks)}")

# Check the data of the first chunk
if chunks:
    print("\n--- Sample of the first Chunk ---")
    print(chunks[0].page_content)
    print(f"\nSource: {chunks[0].metadata}")


#--------------------------------------------------------------------------------------------
#---------------------------------------------------------------------------------------------



from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# 5. Load the Embedding Model
# This will download the open-source embedding model the first time it runs
print("\nLoading the embedding model (this may take a moment on the first run)...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 6. Create and save the Vector Database (ChromaDB)
print("Converting chunks to vectors and creating ChromaDB...")
vector_db_path = "C:\Vector_Database"

vector_db = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory=vector_db_path
)

print(f"\nSuccess! Vector Database successfully created and saved in the '{vector_db_path}' folder.")
