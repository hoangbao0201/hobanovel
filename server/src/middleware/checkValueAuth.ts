

export const checkValueAuth = (data : { name: string, username: string, email: string, password: string, }) => {

    const { name, username, email, password } = data;

    let lt = {
        success: true,
        name: "",
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
    if (specialCharsRegex.test(name)) {
        lt = {
            ...lt,
            success: false,
            name: "Tên chứa kí tự đặt biệt"
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
    if (name.length < 5 || name.length > 25) {
        lt = {
            ...lt,
            success: false,
            name: "Tên từ 5 đến 25 kí tự"
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