import os
import sys

# 1. Force Python to use the packages inside your .venv folder
# This bypassing the interpreter settings in VS Code
venv_site_packages = r"D:\llm project\Codes_Pych\.venv\Lib\site-packages"
if venv_site_packages not in sys.path:
    sys.path.insert(0, venv_site_packages)

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 2. Set your new API Key securely
os.environ["GROQ_API_KEY"] = "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"

# 3. Setup Vector Database and Retriever
print("Loading the vector store and retriever...")
vector_db_path = r"D:\llm project\Vector_Database"
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = Chroma(persist_directory=vector_db_path, embedding_function=embeddings)

retriever = vector_db.as_retriever(search_kwargs={"k": 3})

# Helper function to format retrieved documents into a single text block
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# 4. Initialize the LLM
print("Initializing the LLM...")
llm = ChatGroq(model_name="qwen/qwen3.8-27b", temperature=0)

# 5. Create the Prompt Template
system_prompt = (
    "You are an expert legal assistant in Sri Lanka. "
    "Use the following retrieved context to answer the user's question. "
    "If the answer is not in the context, say 'I cannot find the answer in the provided legal documents.' "
    "Do not guess or invent answers.\n\n"
    "Context: {context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

# 6. Build the RAG chain using LCEL (No need for langchain.chains module)
print("Building the RAG chain using LCEL...")
rag_chain = (
    {"context": retriever | format_docs, "input": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 7. Ask the Question and Generate the Final Answer
user_query = "Can I submit an affidavit in the Sinhala language?"
print(f"\nUser Query: {user_query}\n")
print("Generating the final answer based on legal documents...\n")

# Note: In LCEL, we directly pass the string query instead of a dictionary
response = rag_chain.invoke(user_query)

print("--- Final Answer ---")
print(response)