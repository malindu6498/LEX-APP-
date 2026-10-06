import streamlit as st
import os
import sys
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 1. Page Configuration
st.set_page_config(page_title="Sri Lanka Legal Assistant AI", page_icon="⚖️")
st.title("⚖️ Sri Lanka Legal Assistant AI")

# 2. Set API Key Securely
os.environ["GROQ_API_KEY"] = "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"

# 3. Force Python to use .venv packages
venv_site_packages = r"D:\llm project\Codes_Pych\.venv\Lib\site-packages"
if venv_site_packages not in sys.path:
    sys.path.insert(0, venv_site_packages)


# 4. Cache the Vector DB loading to prevent reloading on every chat message
@st.cache_resource
def load_retriever():
    vector_db_path = r"D:\llm project\Vector_Database"
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_db = Chroma(persist_directory=vector_db_path, embedding_function=embeddings)
    return vector_db.as_retriever(search_kwargs={"k": 3})


retriever = load_retriever()


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


# 5. Initialize the LLM
llm = ChatGroq(model_name="qwen/qwen3.8-27b", temperature=0)

system_prompt = (
    "You are an empathetic and professional Legal Consultant in Sri Lanka. "
    "A client will describe a real-world scenario, personal problem, or injustice they faced. "
    "Your task is to analyze their situation using ONLY the provided legal context. "
    "Follow these steps to structure your response:\n"
    "1. Analysis: Carefully analyze the client's story to identify if any laws have been broken, rights violated, or if a legal injustice has occurred according to the context.\n"
    "2. Explanation: Explain the relevant law clearly and simply to the client, citing the specific Acts and Sections from the context.\n"
    "3. Actionable Advice: Provide practical next steps. Clearly state if the client has a strong case and whether they should strongly consider consulting a human lawyer, filing a police complaint, or taking court action.\n"
    "If the provided context does not contain relevant laws to judge their specific scenario, politely state that you cannot provide legal advice on this specific matter based on the currently available documents.\n\n"
    "Context: {context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

# 6. Build the RAG chain
rag_chain = (
        {"context": retriever | format_docs, "input": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
)

# 7. Initialize Chat History in Session State
if "messages" not in st.session_state:
    st.session_state.messages = []

# 8. Display Chat History
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 9. Handle User Input
if user_query := st.chat_input("Ask a legal question (e.g., Can I submit an affidavit in Sinhala?)"):

    # Display user query
    st.session_state.messages.append({"role": "user", "content": user_query})
    with st.chat_message("user"):
        st.markdown(user_query)

    # Generate and display assistant response
    with st.chat_message("assistant"):
        with st.spinner("Searching Sri Lankan legal documents..."):
            try:
                response = rag_chain.invoke(user_query)
                st.markdown(response)
                # Save response to history
                st.session_state.messages.append({"role": "assistant", "content": response})
            except Exception as e:
                st.error(f"An error occurred: {e}")