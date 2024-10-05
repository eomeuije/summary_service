## 요약 python script 실행을 위한 가상환경 설정
```sh
prompt> cd summary_service
prompt> python -m venv venv # 파이썬 (권장 >= 3.8)
prompt> ./venv/Scripts/activate # Windows
prompt> ./venv/bin/activate  # Mac/Linux
(venv) prompt> pip install -r requirements.txt
(venv) prompt> deactivate
```

## 요약 모델 다운로드
[https://drive.google.com/file/d/1dbiG6syx4nwFmdt5V-MEIzFdGGPqCEkS/view?usp=sharing](https://drive.google.com/file/d/1dbiG6syx4nwFmdt5V-MEIzFdGGPqCEkS/view?usp=sharing)
<br>다운로드 받은 zip을 ./summary_service 폴더 아래에 압축해제

## node.js 패키지 및 python 모듈 설치 자동 실행
```sh
prompt> ./install.bat # Windows
```