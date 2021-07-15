import pandas as pd
import requests
import json

testing_df = pd.read_csv('./data_test.txt', delimiter='\n', header=None)
print(testing_df[0].tolist())

# headers = {"content-type": "application/json"}
# json_response = requests.post('http://localhost:8501/v1/models/saved_model:predict', data = headers=headers)
# predictions = json.loads(json_response.text)['predictions']