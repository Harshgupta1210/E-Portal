import uuid
import cv2
import os
uuid.uuid1()

VER_PATH = os.path.join('FaceId','application_data', 'verification_images')
#Establish a connection to webcam
cap = cv2.VideoCapture(0)
while True:
    ret,frame = cap.read()
    #cut down frame to 250*250px
    frame = frame[120:120+250,200:200+250,:]
    cv2.imshow('Webcam', frame)
    key = cv2.waitKey(1)
    #collect anchor
    if key & 0XFF == ord('v'):
        imgname = os.path.join(VER_PATH,'{}.jpg'.format(uuid.uuid1()))
        cv2.imwrite(imgname,frame)
        break
#Release webcam
cap.release()
#close the image show frame
cv2.destroyAllWindows()