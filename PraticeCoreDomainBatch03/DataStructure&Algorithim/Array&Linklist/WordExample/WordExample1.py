patient = []

def add_patient():
    patient_ID = input("Enter patient ID: ")
    name = input("Enter patient name: ")
    age = input("Enter patient age: ")
    disease = input("Enter patient disease: ")
    room_number = input("Enter room Number:")

    patient.append({
        "patient_ID": patient_ID,
        "name": name,
        "age": age,
        "disease": disease,
        "room_number": room_number
    })

def remove_patient(id):
    for i in range(len(patient)):
        if patient[i]["patient_ID"] == id:
            del patient[i]
            return

def display_patients(id):
    for i in patient:
        if i['patient_ID'] == id:
            print(i)
            return
    
def display_all_patients():
    print("Patient List:")
    for i in patient:
        print(i)



# --------------- Treatment History ----------------

class TreatmentNode:
    def __init__(self, patient_id,treatment, doctor, date):
        self.patient_id = patient_id
        self.treatment = treatment
        self.doctor = doctor
        self.date = date 
        self.next = None
    


global head 
head = None

def add_treatment_history(patient_id, treatment, doctor, data):
    global head 
    new_node = TreatmentNode(patient_id, treatment, doctor, data)
    if head is None:
        head = new_node
    else:
        current = head
        while current.next is not None:
            current = current.next
        current.next = new_node
        new_node.next = None


def display_treatment_history(patient_id):
    global head
    current = head
    print(f"Treatment history for patient id {patient_id}:")
    while current is not None:
        if current.patient_id == patient_id:
            print(f"Treatment: {current.treatment}, Doctor: {current.doctor}, Date: {current.date}")
        current = current.next


def delete_treatment_record(patient_id, treatment):
    global head
    current = head
    prev = None
    while current is not None:
        if current.patient_id == patient_id and current.treatment == treatment:
            if prev is None:
                head = current.next
            else:
                prev.next = current.next
            return
        prev = current
        current = current.next




while True:
    print("========== Hospital Management System ==========")
    print("1. Add New Patient")
    print("2. Remove Patient by ID")
    print("3. Search Patient by ID")
    print("4. Display All Patients")
    print("5. Add Treatment Record")
    print("6. Display Treatment History of a Patient")
    print("7. Delete Treatment Record")
    print("8. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        add_patient()
    elif choice == 2:
        id = input("Enter patient ID to remove: ")
        remove_patient(id)
    elif choice == 3:
        id = input("Enter patient ID to search: ")
        display_patients(id)
    elif choice == 4:
        display_all_patients()
    elif choice == 5:
        patient_id = input("Enter patient ID: ")
        treatment = input("Enter treatment details: ")
        doctor = input("Enter doctor's name: ")
        date = input("Enter date of treatment: ")
        add_treatment_history(patient_id, treatment, doctor, date)
    elif choice == 6:
        patient_id = input("Enter patient ID to view treatment history: ")
        display_treatment_history(patient_id)
    elif choice == 7:
        patient_id = input("Enter patient ID: ")
        treatment = input("Enter treatment details to delete: ")
        delete_treatment_record(patient_id, treatment)
    elif choice == 8:
        print("Exiting the system. Goodbye!")
        break

