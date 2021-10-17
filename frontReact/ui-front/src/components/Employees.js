import React, { useEffect, useState } from "react";
import { APIS } from "../constants/endpoints";
import { Employee } from "./Employee";

export const Employees = (props) => {
    const [allValues, setAllValues] = useState({
        departments: [],
        employees: [],
        modalTitle: '',
        EmployeeName: '',
        EmployeeID: 0,
        Department: '',
        DateOfJoining: '',
        PhotoFileName: 'anonymous.png',
        PhotoPath: APIS.PHOTO_URL
    });

    useEffect(() => {
        let isMounted = true;
        refreshList(isMounted);
        return () => {
            isMounted = false;
        }
    }, [allValues.employees.length]);

    const refreshList = async (isMounted) => {
        try {
            const resp = await fetch(APIS.EMPLOYEE, {cache: "force-cache"});
            const resp2 = await fetch(APIS.DEPARTMENT, {cache: "force-cache"});
            const data2 = await resp2.json();
            const data = await resp.json();

            if (isMounted) {
                return setAllValues(prev => {
                    return {
                        ...prev,
                        employees: data,
                        departments: data2
                    }
                });
            }
        } catch (e) { }
    }

    const changeEmployeeName = (e) => {
        return setAllValues(prev => {
            return {
                ...prev,
                EmployeeName: e.target.value
            }
        })
    }

    const modifyEmployee = (employeeId) => {
        if (employeeId === 0) {
            return (
                <button className="btn btn-primary float-start" onClick={saveOnDbEmployee}>
                    Create
                </button>
            )
        } else if (employeeId !== 0) {
            return (
                <button className="btn btn-primary float-start" onClick={updateOnDbEmployee}>
                    Update
                </button>
            )
        }
        return null;
    }

    const addNewEmployee = () => {
        return setAllValues(prev => {
            return {
                ...prev,
                modalTitle: 'Add new Employee',
                EmployeeId: 0,
                EmployeeName: ''
            }
        })
    }

    async function deleteOnDbEmployee(id) {
        if (window.confirm('Are you sure?')) {
            const resp = await fetch(`${APIS.EMPLOYEE}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const data = await resp.json();
            console.log('Saveeed', data);
            refreshList(true);
        }
    }

    async function updateOnDbEmployee() {
        const { EmployeeName, EmployeeId, Department, DateOfJoining, PhotoFileName } = allValues;

        const resp = await fetch(APIS.EMPLOYEE, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EmployeeId,
                EmployeeName,
                Department,
                DateOfJoining,
                PhotoFileName
            })
        });
        const data = await resp.json();
        console.log('Saveeed', data);
        refreshList(true);
    }

    async function saveOnDbEmployee() {
        const { EmployeeName, Department, DateOfJoining, PhotoFileName } = allValues;

        const resp = await fetch(APIS.EMPLOYEE, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EmployeeName,
                Department,
                DateOfJoining,
                PhotoFileName
            })
        });
        const data = await resp.json();
        console.log('Saveeed', data);
        refreshList(true);
    }

    const editEmployee = (employee) => {
        const {
            EmployeeId,
            EmployeeName,
            Department,
            DateOfJoining,
            PhotoFileName
        } = employee;

        return setAllValues(prev => {
            return {
                ...prev,
                modalTitle: 'Edit Employee',
                EmployeeId,
                EmployeeName,
                Department,
                DateOfJoining,
                PhotoFileName
            }
        })
    }

    const changeDepartment = (e) => {
        return setAllValues(prev => {
            return {
                ...prev,
                Department: e.target.value
            }
        })
    }

    const changeDateOfJoining = (e) => {
        return setAllValues(prev => {
            return {
                ...prev,
                DateOfJoining: e.target.value
            }
        })
    }

    async function imageUpload(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', e.target.files[0], e.target.files[0].name);

        const resp = await fetch(`${APIS.EMPLOYEE}/savefile`, {
            method: 'POST',
            body: formData
        });
        const data = await resp.json();

        setAllValues(prev => {
            return {
                ...prev,
                PhotoFileName: data
            };
        });
    }

    const showDepartmentsList = () => {
        const { employees, departments, modalTitle, DateOfJoining, EmployeeName, EmployeeId, PhotoPath, PhotoFileName, Department } = allValues;

        return (
            <div>
                <button onClick={addNewEmployee} type="button" className="btn btn-primary m-2 float-end" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Add Employee
                </button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Department</th>
                            <th>DOJ</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => {
                            return Employee(employee, editEmployee, deleteOnDbEmployee);
                        })}
                    </tbody>
                </table>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {modalTitle}
                                </h5>
                                <button className="btn-close" type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex flex-row bd-highlight mb-3">
                                    <div className="p-2 w-50 bd-highlight">
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Employee Name</span>
                                            <input type="text" className="form-control" value={EmployeeName} onChange={changeEmployeeName} />
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Department</span>
                                            <select className="form-select" onChange={changeDepartment} value={Department}>
                                                {departments.map(dep => <option key={dep.DepartmentId}>
                                                    {dep.DepartmentName}
                                                </option>)}
                                            </select>
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">DOJ</span>
                                            <input type="date" className="form-control" value={DateOfJoining} onChange={changeDateOfJoining} />
                                        </div>
                                    </div>
                                    <div className="p-2 w-50 bd-highlight">
                                        <img alt="" width="250px" height="200px" src={`${PhotoPath}/${PhotoFileName}`} />
                                        <input type="file" className="m-2" onChange={imageUpload} />
                                    </div>
                                </div>
                                {modifyEmployee(EmployeeId)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return showDepartmentsList()
}
