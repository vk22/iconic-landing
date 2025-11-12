interface Result {
  success?: boolean
  title?: string
  message?: string
}

export const usePopup = () => {
  const isPopupOpen = useState<boolean>('popup:isPopupOpen', () => false)
  const isFormOpen = useState<boolean>('popup:isFormOpen', () => false)
  const isSuccessOpen = useState<boolean>('popup:isSuccessOpen', () => false)
  const formResult = useState<Result>('popup:formResult', () => ({}))

  function setPopupMode(payload: boolean) {
    console.log('setPopupMode', payload)
    isPopupOpen.value = payload
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
