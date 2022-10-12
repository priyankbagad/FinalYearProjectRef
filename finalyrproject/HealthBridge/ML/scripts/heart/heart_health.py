import numpy as np
import  pandas as pd
import pickle



def helth(age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal):
    ENTRY_DICT = {
        "age": age,
        "sex": sex,
        "cp": cp,
        "trestbps": trestbps,
        "chol": chol,
        "fbs": fbs,
        "restecg": restecg,
        "thalach": thalach,
        "exang": exang,
        "oldpeak": oldpeak,
        "slope": slope,
        "ca": ca,
        "thal": thal
    }
    patient = pd.DataFrame.from_dict(ENTRY_DICT, orient='index')
    arr = patient.values
    arr = arr.flatten()
    arr = arr.reshape(1, -1)
    # print(arr)
    # with open("heart.pickle", 'rb') as f:
    #f = open("ML\scripts\heart\Heart.pickle",'rb')
    #rf = pickle.load(f)
    # print(patient.values.flatten(), "\n\n\n")
    #result = rf.predict(arr)
    if int(chol)>= 130 : 
        result = 1
    else:
        result = 0    
    if result == 0:
        RES_DICT = {"result":"Healthy"}
        return RES_DICT
    else:
        RES_DICT = {"result":"Not Healthy"}
        return RES_DICT



# if __name__ == "__main__":
#     main(age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal)