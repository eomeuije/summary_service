import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import os
import json
import argparse

def summarize(content: str, device: str):

    if not device:
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    model_dir = os.path.join(os.path.dirname(__file__), '..', '..', './korean_paper_summary')
    finetuned_model = AutoModelForSeq2SeqLM.from_pretrained(model_dir).to(device)
    finetuned_tokenizer = AutoTokenizer.from_pretrained(model_dir)

    inputs = finetuned_tokenizer(content, return_tensors="pt", max_length=1024, truncation=True)

    inputs = {key: value.to(device) for key, value in inputs.items()}

    summary_ids = finetuned_model.generate(inputs["input_ids"], num_beams=4, max_length=350, early_stopping=True)
    summary = finetuned_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return summary

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="summarize script")
    parser.add_argument("-c", "--country", default="많은 관련연구들이 개별이용자들의 주제적, 비주제적 정보요구가 반영된 이용자지향 색인의 중요성을 강조하였지만, 실제 상용되고 있는 많은 검색시스템은 이러한 이용자들의 다양한 요구를 지원하기보다는 주제적 속성과 관련된 탐색만을 효과적으로 지원하고 있다. 대통령이미지 검색 컬렉션도 이에 해당된다. 이에 본 연구는 한국의 주요 대통령 사진 기록물을 대상으로 다양한 영역의 잠재적 이용자들이 제시한 기술어들을 조사하여 색인어 다양화를 위한 접근점의 다원화를 모색하고 있다. 이는 대통령기록물의 경우 다양한 이용자 그룹에 의한 활용이 강조되어온 바, 이러한 다양성에 부합하는 연구라는 점에 의의가 있다고 할 수 있다. 식별된 기술어들을 토대로 본 연구는 주제어중심으로 구성된 대통령이미지 컬렉션의 기술어군에 대한 개선점을 제안하였다. 제안점은 전공영역을 감안한 기술어채택의 다양화와 이를 활용하기위한 인터페이스구성과 관련된다.")
    parser.add_argument("-d", "--device")

    args = parser.parse_args()

    summary = summarize(content=args.country, device=args.device)
    print(json.dumps({"summary": summary}))
