import os
from groq import Groq

# 1. ඔබගේ අලුත් Groq API Key එක මෙතනට දෙන්න
# (මීට පෙර මකා දැමූ Key එක වෙනුවට අලුතින් ගත් Key එක ලබාදීමට වග බලාගන්න)
os.environ["GROQ_API_KEY"] = "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"

print("Checking available models for your API Key...\n")

try:
    client = Groq()
    models = client.models.list()

    print("ඔබගේ ගිණුමට දැනට භාවිතා කළ හැකි Models ලැයිස්තුව:\n")
    for m in models.data:
        print(f"- {m.id}")

except Exception as e:
    print(f"API Key එකෙහි හෝ ගිණුමෙහි ගැටලුවක් ඇත: {e}")