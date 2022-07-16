import DownloadCSV from "./csvDownload"

export const DownloadFile = async (fetch, name) => {
  let data = await fetch()
  let result = data.map(el => {
    let obj = {};
    Object.entries(el).forEach(([key, val]) => {
      if (key !== 'hashPassword')
        obj[key] = val;
    })
    return obj;
  });
  console.log(result)
  DownloadCSV(data, name)
}

