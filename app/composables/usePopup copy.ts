import { ref } from 'vue'

interface Result {
    success?: boolean;
    title?: string;
    message?: string;
}

export const usePopup = () => {
    const isPopupOpen = ref<boolean>(false)
    const isFormOpen = ref<boolean>(false)
    const isSuccessOpen = ref<boolean>(false)
    const formResult = ref<Result>({});

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

    function setResult(result: object) {
        formResult.value = result
    }

    return {
        isPopupOpen, 
        isFormOpen,
        isSuccessOpen,
        setPopupMode,
        setFormMode,
        setSuccessMode,
        setResult,
        formResult
    }
}
