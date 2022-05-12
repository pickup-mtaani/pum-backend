import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTodo, deleteTodo } from "./../redux/actions/todo.actions";
import EditModal from "./EditTaskModal";
export default function TodoItem(props) {
  const { data } = props;
  const dispatch = useDispatch();

  const todos = useSelector((state) => state.todoDetails.todos);
  const [showModal, setShowModal] = useState(false);
  const [todo, setTodo] = useState("");
  const [todoObj, setTodoObj] = useState({});
  const inputChange = (e) => {
    setTodo(e.target.value);
  };
  const toggleModal = (item) => {
    setShowModal((prevState) => !prevState);
    setTodoObj(item);
    setTodo(todoObj.todo);
  };

  const update = () => {
    const data = { todo: todo, isDone: todoObj.isDone };
    const id = todoObj._id;
    dispatch(updateTodo(id, data));
    toggleModal();
  };

  const complete = (data) => {
    const id = data._id;
    dispatch(updateTodo(id, { todo: data.todo, isDone: true }));
  };
  const remove = (data) => {
    const id = data._id;
    dispatch(deleteTodo(id));
  };
  return (
    <div className="w-full flex justify-between px-5 border-b border-slate-500">
      <div className="flex justify-center items-center  ">
        <input
          type="checkbox"
          id="vehicle1"
          onChange={() => complete(data)}
          name="vehicle1"
          checked={data.isDone}
          className="mx-2"
        ></input>
        <h1 className=" capitalize">{data.todo}</h1>
      </div>
      <div className="gap-x-2 h-10  flex justify-center items-center">
        {!data.isDone && (
          <div>
            <button
              className="bg-green-200 shadow-md px-2 w-20 rounded-md"
              onClick={() => complete(data)}
            >
              Complete
            </button>
          </div>
        )}
        {/* <button className="bg-green-400 w-20 shadow-md px-2 rounded-md">
          Edit
        </button> */}
        <EditModal
          toggleModal={() => toggleModal(data)}
          todo={todoObj}
          show={showModal}
          setTodo={inputChange}
          Submit={update}
        />
        <button
          className="bg-red-500 w-20 shadow-md px-2 rounded-md"
          onClick={() => remove(data)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
