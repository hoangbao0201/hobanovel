

export const checkValueAuth = (data : { fullname: string, username: string, email: string, password: string, }) => {

    const { fullname, username, email, password } = data;

    let lt = {
        success: true,
        fullname: "",
        username: "",
        email: "",
        password: "",
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharsRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>?`~]/;

    // ---
    // if (specialCharsRegex.test(lastName)) {
    //     lt = {
    //         ...lt,
    //         success: false,
    //         lastName: "Họ chứa kí tự đặt biệt"
    //     }
    // }
    if (specialCharsRegex.test(fullname)) {
        lt = {
            ...lt,
            success: false,
            fullname: "Tên chứa kí tự đặt biệt"
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
    // if (lastName.length < 3 || lastName.length > 20) {
    //     lt = {
    //         ...lt,
    //         success: false,
    //         lastName: "Họ từ 3 đến 20 kí tự"
    //     }
    // }
    if (fullname.length < 5 || fullname.length > 25) {
        lt = {
            ...lt,
            success: false,
            fullname: "Tên từ 5 đến 25 kí tự"
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