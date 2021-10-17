import React, { useEffect, useState } from "react";
import { APIS } from "../constants/endpoints";
import { Department } from "./Department";

export const Departments = (props) => {
    const [allValues, setAllValues] = useState({
        departments: [],
        modalTitle: '',
        DepartmentName: '',
        DepartmentId: 0,
        departmentsWithoutFilter: []
    });

    useEffect(() => {
        let isMounted = true;
        refreshList(isMounted);
        return () => {
            isMounted = false;
        }
    }, [allValues.departments.length]);

    const changeDepartmenIdFilter = (e) => {
        const { departmentsWithoutFilter } = allValues;
        const depIdValue = e.target.value;
        const filteredDeps = departmentsWithoutFilter.filter(dep => {
            return dep.DepartmentId === Number(depIdValue);
        });

        return setAllValues(prev => {
            if (depIdValue) {
                return {
                    ...prev,
                    departments: filteredDeps
                }
            }
            return {
                ...prev,
                departments: departmentsWithoutFilter
            }
        });
    }

    const changeDepartmenNameFilter = (e) => {
        const { departmentsWithoutFilter } = allValues;
        const depIdValue = e.target.value;
        const filteredDeps = departmentsWithoutFilter.filter(dep => {
            return dep.DepartmentName.toLowerCase().trim().includes(depIdValue.toLowerCase().trim());
        });

        return setAllValues(prev => {
            if (depIdValue) {
                return {
                    ...prev,
                    departments: filteredDeps
                }
            }
            return {
                ...prev,
                departments: departmentsWithoutFilter
            }
        });
    }

    const refreshList = async (isMounted) => {
        try {
            const resp = await fetch(APIS.DEPARTMENT, {cache: "force-cache"});
            const data = await resp.json();
            if (isMounted) {
                return setAllValues(prev => {
                    return {
                        ...prev,
                        departments: data,
                        departmentsWithoutFilter: data
                    }
                });
            }
        } catch (e) { }
    }

    const sortDepartments = (sortBy, asc) => {
        const { departmentsWithoutFilter } = allValues;
        const mapValues = {
            'DepartmentId': asc ? departmentsWithoutFilter.sort((a, b) => a[sortBy] - b[sortBy]) : departmentsWithoutFilter.sort((a, b) => b[sortBy] - a[sortBy]),
            'DepartmentName': asc ? departmentsWithoutFilter.sort((a, b) => String(a[sortBy]).localeCompare(String(b[sortBy]))) : departmentsWithoutFilter.sort((a, b) => String(b[sortBy]).localeCompare(String(a[sortBy])))
        }
        const sortedDepartments = mapValues[sortBy];

        return setAllValues(prev => {
            return {
                ...prev,
                departments: sortedDepartments
            }
        })
    }

    const changeDepartmentName = (e) => {
        return setAllValues(prev => {
            return {
                ...prev,
                DepartmentName: e.target.value
            }
        })
    }

    const modifyDepartment = (depId) => {
        if (depId === 0) {
            return (
                <button className="btn btn-primary float-start" onClick={saveOnDbDepartment}>
                    Create
                </button>
            )
        } else if (depId !== 0) {
            return (
                <button className="btn btn-primary float-start" onClick={updateOnDbDepartment}>
                    Update
                </button>
            )
        }
        return null;
    }

    const addNewDepartment = () => {
        return setAllValues(prev => {
            return {
                ...prev,
                modalTitle: 'Add new Department',
                DepartmentId: 0,
                DepartmentName: ''
            }
        })
    }

    async function deleteOnDbDepartment(id) {
        if (window.confirm('Are you sure?')) {
            await fetch(`${APIS.DEPARTMENT}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return refreshList();
        }
    }

    async function updateOnDbDepartment() {
        const { DepartmentName, DepartmentId } = allValues;

        await fetch(APIS.DEPARTMENT, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DepartmentId,
                DepartmentName
            })
        });
        return refreshList();
    }

    async function saveOnDbDepartment() {
        const { DepartmentName } = allValues;

        await fetch(APIS.DEPARTMENT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DepartmentName
            })
        });
        return refreshList();
    }

    const editDepartment = (dep) => {
        const { DepartmentId, DepartmentName } = dep;

        return setAllValues(prev => {
            return {
                ...prev,
                modalTitle: 'Edit Department',
                DepartmentId,
                DepartmentName
            }
        })
    }

    const showDepartmentsList = () => {
        const { departments, modalTitle, DepartmentName, DepartmentId } = allValues;

        return (
            <div>
                <button onClick={addNewDepartment} type="button" className="btn btn-primary m-2 float-end" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Add Department
                </button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>
                                <div className="d-flex flex-row">
                                    <input className="form-control m-2" placeholder="Filter" onChange={changeDepartmenIdFilter} />
                                    <button type="button" className="btn btn-light me-2" onClick={() => sortDepartments('DepartmentId', true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-numeric-up" viewBox="0 0 16 16">
                                            <path d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z" />
                                            <path fillRule="evenodd" d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z" />
                                            <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z" />
                                        </svg>
                                    </button>
                                    <button type="button" className="btn btn-light" onClick={() => sortDepartments('DepartmentId', false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-numeric-down-alt" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M11.36 7.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.836 1.973-1.836 1.09 0 2.063.637 2.063 2.688 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z" />
                                            <path d="M12.438 8.668V14H11.39V9.684h-.051l-1.211.859v-.969l1.262-.906h1.046zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />
                                        </svg>
                                    </button>
                                </div>
                                Department ID
                            </th>
                            <th>
                                <div className="d-flex flex-row">
                                    <input className="form-control m-2" placeholder="Filter" onChange={changeDepartmenNameFilter} />
                                    <button type="button" className="btn btn-light me-2" onClick={() => sortDepartments('DepartmentName', true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z" />
                                            <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />
                                        </svg>
                                    </button>
                                    <button type="button" className="btn btn-light" onClick={() => sortDepartments('DepartmentName', false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-down-alt" viewBox="0 0 16 16">
                                            <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z" />
                                            <path fillRule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z" />
                                            <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />
                                        </svg>
                                    </button>
                                </div>
                                Department Name
                            </th>
                            <th>
                                Options
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dep) => {
                            return Department(dep, editDepartment, deleteOnDbDepartment);
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
                                <div className="input-group mb-3">
                                    <span className="input-group-text">Department Name</span>
                                    <input type="text" className="form-control" value={DepartmentName} onChange={changeDepartmentName} />
                                </div>
                                {modifyDepartment(DepartmentId)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return showDepartmentsList()
}
