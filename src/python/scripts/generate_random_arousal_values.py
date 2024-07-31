import random

file_path = input('Enter the path to the file to write to: \n')
data_points = int(input('Enter the number of data points you want: \n'))
time_step = float(input('Enter the time step (in seconds) you want: \n'))

f = open(file_path, 'w')

f.write('[\n')
for i in range(data_points):
    current_value = random.uniform(-1, 1)

    f.write('   {\n')
    f.write('       "time": {},\n'.format(time_step*i))
    f.write('       "value": {}\n'.format(current_value))
    f.write('   }')
    if(i != data_points - 1):
        f.write(',\n')
    else:
        f.write('\n')

f.write(']')

f.close()

print('File has been written to! 8=====D')

