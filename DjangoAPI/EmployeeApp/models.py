from django.db import models

# Create your models here.
# We need 2 models -> 1 to store Departments Details and 2 Employee Details

class Departments(models.Model):
    # Departments model will have 2 fields
    DepartmentId = models.AutoField(primary_key=True)
    DepartmentName = models.CharField(max_length=500)

class Employees(models.Model):
    # Employee model will have 5 fields
    EmployeeId = models.AutoField(primary_key=True)
    EmployeeName = models.CharField(max_length=500)
    Department = models.CharField(max_length=500)
    DateOfJoining = models.DateField()
    PhotoFileName = models.CharField(max_length=500)
