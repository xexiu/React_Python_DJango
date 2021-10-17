import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import './App.css';
import { Departments } from './components/Departments';
import { Employees } from './components/Employees';
import { Home } from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h3 className="d-flex justify-content-center m-3">
          React JS FrontEnd
        </h3>
        <nav className="navbar navbar-expand-sm bg-light navbar-dark">
          <ul className="navbar-nav">
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/home">Home</NavLink>
            </li>
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/department">Departments</NavLink>
            </li>
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/employee">Employees</NavLink>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/department" component={Departments} />
          <Route path="/employee" component={Employees} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
