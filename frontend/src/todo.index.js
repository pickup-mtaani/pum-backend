import React, { useEffect, useState } from "react";
import AddTodoModal from "./components/addTodo.componenet";

import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { getTodo, postTodo, updateTodo } from "./redux/actions/todo.actions";
import TodoItem from "./components/todoItem.component";

export function Todo(props) {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todoDetails.todos);
  const [showModal, setShowModal] = useState(false);
  const [todo, setTodo] = useState("");
  const [todoObj, setTodoObj] = useState({});
  const inputChange = (e) => {
    setTodo(e.target.value);
  };

  const Submit = () => {
    const data = { todo: todo };
    dispatch(postTodo(data));
    setShowModal(false);
  };
  const complete = () => {
    const data = { isDone: true };
    const id = todoObj.id;
    dispatch(updateTodo({ id, data }));
  };
  const user = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    dispatch(getTodo());
  }, [todos]);

  return (
    <div className="w-full h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-gray-400  w-full h-full m-2 relative z-0">
        <div className="absolute inset-0 flex justify-center rounded-lg items-center z-10 bg-white m-10">
          <div className="w-full h-full flex flex-col">
            <div className="h-10 bg-slate-500">
              <div className="flex justify-between mx-10">
                <div></div>
                <div className="flex justify-center items-center pt-2">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <h2 className="text-xl capitalize">{user ? user.username : "Seed User"}</h2>
                </div>
              </div>
            </div>
            <div className="h-5/6 ">
              <div className="flex w-full">
                <div className="w-1/2 md:w-full pb-2 bg-slate-200">
                  <h3 className="text-3xl uppercase text-center pt-5 pb-3">
                    My Active Tasks
                  </h3>
                  <AddTodoModal
                    showModal={setShowModal}
                    todo={todo}
                    show={showModal}
                    todoObj={todoObj}
                    setTodoObj={setTodoObj}
                    complete={complete}
                    setTodo={inputChange}
                    Submit={Submit}
                  />

                  {todos
                    .filter((todo) => todo.isDone === false)
                    .map((complete) => (
                      <TodoItem key={complete.id} data={complete} />
                    ))}
                </div>
                <div className="w-1/2 md:w-full pb-2 bg-blue-100 border border-l-slate-800 border-dotted">
                  <h3 className="text-3xl uppercase text-center pt-5 pb-16">
                    My Completed Tasks
                  </h3>

                  {todos
                    .filter((todo) => todo.isDone)
                    .map((complete) => (
                      <TodoItem key={complete.id} data={complete} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    error: state.todoDetails.error,
    loading: state.todoDetails.loading,
    todos: state.todoDetails.todos,
    // pager: state.todoDetails.pager,
    // types: state.typesData.types,
    // levels: state.levelData.levels,
    // areas: state.areaData.areas,
    // user: state.userDetails.user,
    // instituitions: state.instituitionData.instituitions,
  };
};

export default connect(mapStateToProps, { getTodo })(Todo);
