import DownloadCSV from "./csvDownload"

export const DownloadFile = async (fetch, name) => {
    let data = await fetch()
    DownloadCSV(data, name)
  }