// import { forwardRef, useImperativeHandle, useRef } from 'react';
// import { createPortal } from 'react-dom';

// const Modal = forwardRef(function Modal({ children }, ref) {
//   const dialog = useRef();

//   useImperativeHandle(ref, () => {
//     return {
//       open: () => {
//         dialog.current.showModal();
//       },
//       close: () => {
//         dialog.current.close();
//       },
//     };
//   });

//   return createPortal(
//     <dialog className="modal" ref={dialog}>
//       {children}
//     </dialog>,
//     document.getElementById('modal')
//   );
// });

// export default Modal;
//Building the same with useEffect
import {useEffect , useRef} from 'react';
import { createPortal } from 'react-dom';

const Modal = function Modal({ open, children , onClose}) {
  const dialog = useRef();
  useEffect(()=> {
    if(open){
      dialog.current.showModal();
    }else {
      dialog.current.close();
    }
  }, [open])

  return createPortal(
    <dialog ref={dialog} className="modal" onClose={onClose}>
      {open && children}
    </dialog>,
    document.getElementById('modal')
  );
};

export default Modal;