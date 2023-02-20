import axios from "axios";


/* eslint-disable */
export function convertArrayOfObjectsToCSV(array) {
  let result;

  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  const keys = Object.keys(array[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach(item => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];

      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}
export default function DownloadCSV(array, name) {
  let newArray = []
  for (let i = 0; i < array.length; i++) {
    let obj = array[i];

    for (const key in obj) {

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = obj[key].title ? obj[key].title : obj[key].name
      }
    }
    newArray.push(obj);
  }

  const link = document.createElement('a');
  let csv = convertArrayOfObjectsToCSV(newArray);
  if (csv == null) return;

  const filename = `${name}.csv`;

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', filename);
  link.click();
}

const dload = async ({ fileURL, ext, fileName }) => {
  await fetch(fileURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(
        new Blob([blob]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${fileName}.${ext}`,
      );
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });

}
export const DownloadFromApi = async ({ BasefileURL, ext, fileName }) => {
  axios(BasefileURL, {
    method: 'GET',
    responseType: 'blob' //Force to receive data in a Blob Format
  })
    .then(response => {
      //Create a Blob from the PDF Stream
      const file = new Blob(
        [response.data],
        { type: 'application/xlsx' });
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);

      dload({ fileURL, ext, fileName })
      // window.open(fileURL);
    })
    .catch(error => {
      ;
    });
}