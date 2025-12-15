interface Result {
  success?: boolean
  title?: string
  message?: string
}

export const usePopup = () => {
  const isPopupOpen = useState<boolean>('popup:isPopupOpen', () => false)
  const isPopupContentShow = useState<boolean>('popup:isPopupContentShow', () => false)
  const isFormOpen = useState<boolean>('popup:isFormOpen', () => false)
  const isSuccessOpen = useState<boolean>('popup:isSuccessOpen', () => false)
  const formResult = useState<Result>('popup:formResult', () => ({}))

  function setPopupMode(payload: boolean) {
    // console.log('setPopupMode', payload)
    if (payload) {
      isPopupOpen.value = payload
      setTimeout(() => {
        isPopupContentShow.value = payload;
      }, 150);
    } else {
      isPopupContentShow.value = payload;    
      setTimeout(() => {
        isPopupOpen.value = payload
      }, 150);
    }

  }

  function setFormMode(payload: boolean) {
    isFormOpen.value = payload
  }

  function setSuccessMode(payload: boolean) {
    isSuccessOpen.value = payload
  }

  function setResult(result: Result) {
    formResult.value = result
  }

  return {
    // states
    isPopupOpen,
    isPopupContentShow,
    isFormOpen,
    isSuccessOpen,
    formResult,
    // methods
    setPopupMode,
    setFormMode,
    setSuccessMode,
    setResult,
  }
}
