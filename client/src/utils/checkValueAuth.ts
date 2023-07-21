

export const checkValueAuth = (data : { lastName: string, firstName: string, username: string, email: string, password: string, }) => {

    const { lastName, firstName, username, email, password } = data;

    let lt = {
        success: true,
        lastName: "",
        firstName: "",
        username: "",
        email: "",
        password: "",
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharsRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>?`~]/;

    // ---
    if (specialCharsRegex.test(lastName)) {
        lt = {
            ...lt,
            success: false,
            lastName: "Họ chứa kí tự đặt biệt"
        }
    }
    if (specialCharsRegex.test(firstName)) {
        lt = {
            ...lt,
            success: false,
            firstName: "Tên chứa kí tự đặt biệt"
        }
    }
    if (specialCharsRegex.test(username)) {
        lt = {
            ...lt,
            success: false,
            username: "Tên tài khoản chứa kí tự đặt biệt"
        }
    }
    // ---
    if (lastName.length < 3 || lastName.length > 20) {
        lt = {
            ...lt,
            success: false,
            lastName: "Họ từ 3 đến 20 kí tự"
        }
    }
    if (firstName.length < 3 || firstName.length > 20) {
        lt = {
            ...lt,
            success: false,
            firstName: "Tên từ 3 đến 20 kí tự"
        }
    }
    if (username.length < 3 || username.length > 20) {
        lt = {
            ...lt,
            success: false,
            username: "Tên tài khoản từ 3 đến 20 kí tự"
        }
    }
    if (password.length < 3 || password.length > 20) {
        lt = {
            ...lt,
            success: false,
            password: "Mật khẩu từ 3 đến 20 kí tự"
        }
    }



    // Check Email
    if (!emailRegex.test(email)) {
        lt = {
            ...lt,
            success: false,
            email: "Email không hợp lệ"
        }
    }

    return lt;
}