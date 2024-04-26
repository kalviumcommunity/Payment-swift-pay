// import { useState, useEffect } from 'react';
// import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from '@mui/material';
// import CheckIcon from '@mui/icons-material/Check';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import DatePicker from '@mui/lab/DatePicker';




// const DEFAULT_FILE_NAME = "No file selected";
// const DEFAULT_FORM_STATE = {
//   address: "",
//   amount: "",
//   date: null,
//   fileName: DEFAULT_FILE_NAME,
//   file: null,
//   imageBucket: "",
//   imageUrl: "",
//   isConfirmed: false,
//   items: "",
//   locationName: "",
// };

// const ADD_EXPENSE_TITLE = "Add Expense";
// const EDIT_EXPENSE_TITLE = "Edit Expense";
// const CONFIRM_EXPENSE_TITLE = "Confirm Expense";

// export default function ExpenseDialog(props) {
//   const isAdd = props.action === RECEIPTS_ENUM.add;
//   const isEdit = props.action === RECEIPTS_ENUM.edit;
//   const isConfirm = props.action === RECEIPTS_ENUM.confirm;

//   const { authUser } = useAuth();
//   const [formFields, setFormFields] = useState((isEdit || isConfirm) ? props.receipt : DEFAULT_FORM_STATE);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     setFormFields((isEdit || isConfirm) ? props.receipt : DEFAULT_FORM_STATE);
//   }, [props.receipt]);

//   const isDisabled = () => 
//     !isAdd ? 
//       formFields.fileName === DEFAULT_FILE_NAME || !formFields.date || formFields.locationName.length === 0 
//              || formFields.address.length === 0 || formFields.items.length === 0 || formFields.amount.length === 0 :
//       formFields.fileName === DEFAULT_FILE_NAME;

//   const setFileData = (target) => {
//     const file = target.files[0];
//     setFormFields(prevState => ({ ...prevState, fileName: file.name, file }));
//   };

//   const storeImage = async (receiptEnum) => {
//     const bucket = isAdd ? await uploadImage(formFields.file, authUser.uid) : await replaceImage(formFields.file, formFields.imageBucket);
//     if (!bucket) {
//       props.onError(receiptEnum);
//       props.onCloseDialog();
//       throw error;
//     }
//     return bucket;
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);

//     if (isAdd) {
//       try {
//         await storeImage(props.action);
//       } catch (error) {
//         props.onError(props.action);
//         props.onCloseDialog();
//         return;
//       }
//     } else {
//       let bucket = formFields.imageBucket;

//       if (formFields.fileName) {
//         try {
//           bucket = await storeImage(props.action);
//         } catch (error) {
//           props.onError(props.action);
//           props.onCloseDialog();
//           return;
//         }
//       }

//       try {
//         await updateReceipt(formFields.id, authUser.uid, formFields.date, formFields.locationName, formFields.address, formFields.items, formFields.amount, bucket, true);
//       } catch (error) {
//         props.onError(props.action);
//         props.onCloseDialog();
//         return;
//       }
//     }

//     props.onCloseDialog();
//     props.onSuccess(props.action);
//   };

//   return (
//     <Dialog
//       PaperProps={{
//         style: {
//           minWidth: '32em',
//           padding: '0.5em',
//         },
//       }}
//       onClose={props.onCloseDialog}
//       open={isEdit || isConfirm || isAdd}
//       component="form"
//     >
//       <DialogTitle>{dialogTitle}</DialogTitle>
//       <DialogContent>
//         {!isConfirm && (
//           <Stack direction="row" spacing={2} alignItems="center">
//             {(isEdit && !formFields.fileName) && (
//               <Avatar alt="receipt image" src={formFields.imageUrl} sx={{ marginRight: '1em' }} />
//             )}
//             <Button variant="outlined" component="label">
//               Upload Receipt
//               <input type="file" hidden onInput={(event) => setFileData(event.target)} />
//             </Button>
//             <Typography>{formFields.fileName}</Typography>
//           </Stack>
//         )}
//         {(isEdit || isConfirm) ? (
//           <Stack spacing={2} mt={2}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Date"
//                 value={formFields.date}
//                 onChange={(newDate) => setFormFields(prevState => ({ ...prevState, date: newDate }))}
//                 maxDate={new Date()}
//                 renderInput={(params) => <TextField {...params} />}
//               />
//             </LocalizationProvider>
//             <TextField
//               label="Location Name"
//               variant="standard"
//               value={formFields.locationName}
//               onChange={(event) => setFormFields(prevState => ({ ...prevState, locationName: event.target.value }))}
//             />
//             <TextField
//               label="Address"
//               variant="standard"
//               value={formFields.address}
//               onChange={(event) => setFormFields(prevState => ({ ...prevState, address: event.target.value }))}
//             />
//             <TextField
//               label="Items"
//               variant="standard"
//               value={formFields.items}
//               onChange={(event) => setFormFields(prevState => ({ ...prevState, items: event.target.value }))}
//             />
//             <TextField
//               label="Amount"
//               variant="standard"
//               value={formFields.amount}
//               onChange={(event) => setFormFields(prevState => ({ ...prevState, amount: event.target.value }))}
//             />
//           </Stack>
//         ) : null}
//       </DialogContent>
//       <DialogActions>
//         {isSubmitting ? (
//           <Button variant="contained" disabled>
//             {isConfirm ? 'Confirming...' : 'Submitting...'}
//           </Button>
//         ) : (
//           <Button variant="contained" onClick={handleSubmit} disabled={isDisabled()}>
//             {isConfirm ? 'Confirm' : 'Submit'}
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// }

// export function ReceiptRow(props) {
//   const receipt = props.receipt;

//   return (
//     <div>
//       <Stack direction="row" justifyContent="space-between" sx={{ margin: '1em 0' }}>
//         <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
//           <Avatar alt="receipt image" src={receipt.imageUrl} />
//           <Stack direction="column" sx={{ flexGrow: 1 }}>
//             <Typography variant="h6">{format(receipt.date, 'MM/dd/yy')}</Typography>
//             <Typography variant="body2">${receipt.amount}</Typography>
//             <Typography variant="body2">{receipt.locationName} ({receipt.address})</Typography>
//             <Typography variant="body2">{receipt.items}</Typography>
//           </Stack>
//         </Stack>
//         <Stack direction="row" spacing={2}>
//           {props.toConfirm ? (
//             <IconButton color="secondary" onClick={props.onEdit}>
//               <CheckIcon />
//             </IconButton>
//           ) : (
//             <IconButton color="secondary" onClick={props.onEdit}>
//               <EditIcon />
//             </IconButton>
//           )}
//           <IconButton color="secondary" onClick={props.onDelete}>
//             <DeleteIcon />
//           </IconButton>
//         </Stack>
//       </Stack>
//     </div>
//   );
// }
