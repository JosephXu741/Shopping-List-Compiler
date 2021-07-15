import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Embedding, RepeatVector
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.callbacks import ModelCheckpoint
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras import optimizers
import pandas as pd
import numpy as np
import json
import tempfile
import os
import io

from tensorflow.python.keras.saving.save import save_model




def tokenize(line):
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts(line)
    return tokenizer

def encode_sequences(tokenizer, length, lines):
    seq = tokenizer.texts_to_sequences(lines)
    seq = pad_sequences(seq, maxlen=length, padding='post')
    return seq


def define_model(in_vocab, out_vocab, in_timesteps, out_timesteps, units):
    model = Sequential()
    model.add(Embedding(in_vocab, units, input_length=in_timesteps, mask_zero=True))
    model.add(LSTM(units))
    model.add(RepeatVector(out_timesteps))
    model.add(LSTM(units, return_sequences=True))
    model.add(Dense(out_vocab, activation='softmax'))
    return model

def get_word(n, tokenizer):
    for word, index in tokenizer.word_index.items():
        if index == n:
            return word
    return None

def extract_string(preds, label_tokenizer):
    preds_text = []
    for i in preds:
        temp = []
        for j in range(len(i)):
            t = get_word(i[j], label_tokenizer)
            if j > 0:
                if(t == get_word(i[j-1], label_tokenizer)) or (t == None):
                    temp.append('')
                else:
                    temp.append(t)
            else:
                if (t == None):
                    temp.append('')
                else:
                    temp.append(t)
        preds_text.append(' '.join(temp))
    return preds_text

def main():
    # Load the data and labels into a dataframe
    training_df = pd.read_csv('./data.txt', delimiter='\n', header=None)
    label_df = pd.read_csv('./labels.txt', delimiter='\n', header=None)

    # Create tokenizer for the vocabulary in data and labels
    training_tokenizer = tokenize(training_df[0])
    label_tokenizer = tokenize(label_df[0])

    # Define max size of input and output, as well as size of vocab
    training_size = len(training_tokenizer.word_index) + 1
    label_size = len(label_tokenizer.word_index) + 1
    training_length = 16
    label_length = 6

    # Perform one-hot encoding to convert our string tokens into numeric values
    X_train = encode_sequences(training_tokenizer, training_length, training_df[0])
    Y_train = encode_sequences(label_tokenizer, label_length, label_df[0])

    # Create LSTM model 
    model = define_model(training_size, label_size, training_length, label_length, 512)
    rms = optimizers.RMSprop(learning_rate=0.001)
    model.compile(optimizer=rms, loss='sparse_categorical_crossentropy')

    # Train the model
    model.fit(X_train, Y_train.reshape(Y_train.shape[0], Y_train.shape[1], 1), epochs=500, batch_size=2, validation_split=0.01)

    # Predict with the trained model
    preds = np.argmax(model.predict(X_train), axis=-1)

    # Decode the tokenized result into something readable
    result = extract_string(preds, label_tokenizer)

    print(result)

    MODEL_DIR = tempfile.gettempdir()
    version = 1
    export_path = os.path.join(MODEL_DIR, str(version))
    print('export_path = {}\n'.format(export_path))

    tf.keras.models.save_model(
        model,
        export_path,
        overwrite=True,
        include_optimizer=True,
        save_format=None,
        signatures=None,
        options=None
    )

    print('\nSaved model:', export_path)

    ## Save the training tokenizer as a json file with pickle
    training_tokenizer_json = training_tokenizer.to_json()
    label_tokenizer_json = label_tokenizer.to_json()
    with io.open('training_tokenizer.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(training_tokenizer_json))
    with io.open('label_tokenizer.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(label_tokenizer_json))





if __name__ == '__main__':
    main()