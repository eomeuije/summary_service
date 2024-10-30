import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

class summary_model():
    def __init__(self, model_dir, tokenizer_dir, device = None) -> None:
        if not device:
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        else:
            self.device = device
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_dir).to(self.device)
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_dir)
    
    def summarize(self, content: str):
        inputs = self.tokenizer(content, return_tensors="pt", max_length=1024, truncation=True)

        inputs = {key: value.to(self.device) for key, value in inputs.items()}

        summary_ids = self.model.generate(inputs["input_ids"], num_beams=4, max_length=350, early_stopping=True)
        summary = self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)

        return summary
