import { ReactNode } from "react";

import MainLayout from "@/components/Layout/MainLayout";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import Link from "next/link";
import Head from "@/components/Share/Head";
import Breadcrumb from "@/components/Share/Breadcrumb";

const PolicyPage = () => {
    return (
        <>
            <Head title="Chính sách bảo mật - hobanovel" description="Chính sách bảo mật ❶✔️ Web đọc truyện tranh online lớn nhất - Truyện tranh hay nhất, chất lượng được cập nhật liên tục mỗi ngày"/>
            <WrapperLayout>

                <Breadcrumb 
                    path={[
                        { title: "Chính sách bảo mật", url: "/chinh-sach-bao-mat" },
                    ]}
                />

                <div className="px-4">

                    <h1 className="text-2xl font-extrabold mb-5">Chính sách bảo mật</h1>
    
                    <h2 className="text-xl font-bold mb-4">Chúng tôi là ai</h2>
                    <p className="mb-2">Địa chỉ website là: <Link href={`/`} className="text-blue-700"><u>hobanovel.online</u></Link>, website đọc truyện tranh online.</p>
    
                    <h2 className="text-xl font-bold mb-4">
                        Thông tin cá nhân nào bị thu thập và tại sao thu thập
                    </h2>
    
                    <h3 className="text-xl font-bold mb-3">Bình luận</h3>
                    <p className="mb-2">
                        Khi khách truy cập để lại bình luận trên trang web, chúng tôi thu thập dữ
                        liệu được hiển thị trong biểu mẫu bình luận và cũng là địa chỉ IP của người
                        truy cập và chuỗi User Agent của người dùng trình duyệt để giúp phát hiện
                        spam.
                    </p>
                    <p className="mb-2">
                        Một chuỗi ẩn danh được tạo từ địa chỉ email của bạn (còn được gọi là Hash)
                        có thể được cung cấp cho dịch vụ <Link className="text-blue-700" target="_blank" href="https://vi.gravatar.com/"><u>Gravatar</u></Link> để xem bạn có đang sử dụng nó hay
                        không. Chính sách bảo mật của dịch vụ Gravatar có <Link className="text-blue-700" target="_blank" href="https://automattic.com/privacy/"><u>tại đây</u></Link>. Sau khi chấp
                        nhận bình luận của bạn, ảnh tiểu sử của bạn được hiển thị công khai trong
                        ngữ cảnh bình luận của bạn.
                    </p>
                    <h3 className="text-xl font-bold mb-3">Thông tin liên hệ</h3>
                    <p className="mb-2">
                        Chúng tôi không thu thập bất cứ thông tin liên hệ nào của bạn ngoại trừ tên
                        và email dùng để bình luận.
                    </p>
                    <h3 className="text-xl font-bold mb-3">Cookies</h3>
                    <p className="mb-2">
                        Trang chỉ sử dụng cookies để lưu thời hạn của quảng cáo để hiển thị số
                        lượng nhất định, thời hạn chức năng sao lưu dữ liệu và xác thực người dùng.
                        Chúng tôi chủ yếu sử dụng Cookie và Local Storage để lưu tên và email trong
                        bình luận, các chương truyện bạn đã xem, bấm thích, đánh giá truyện, các
                        bình luận của bạn, danh sách truyện yêu thích và danh sách truyện theo dõi.
                    </p>
                    <h3 className="text-xl font-bold mb-3">Nội dung nhúng từ website khác</h3>
                    <p className="mb-2">
                        Các bài viết trên trang web này có thể bao gồm nội dung được nhúng (ví dụ:
                        video, hình ảnh, bài viết, v.v.). Nội dung được nhúng từ các trang web khác
                        hoạt động theo cùng một cách chính xác như khi khách truy cập đã truy cập
                        trang web khác.
                    </p>
                    <p className="mb-2">
                        Những website này có thể thu thập dữ liệu về bạn, sử dụng cookies, nhúng
                        các trình theo dõi của bên thứ ba và giám sát tương tác của bạn với nội
                        dung được nhúng đó, bao gồm theo dõi tương tác của bạn với nội dung được
                        nhúng nếu bạn có tài khoản và đã đăng nhập vào trang web đó.
                    </p>
                    <h3 className="text-xl font-bold mb-3">Phân tích</h3>
                    <p className="mb-2">Chúng tôi sử dụng Google Analytics để phân tích lưu lượng truy cập.</p>
                    <h3 className="text-xl font-bold mb-3">Chúng tôi chia sẻ dữ liệu của bạn với ai</h3>
                    <p className="mb-2">Chúng tôi không chia sẻ dữ liệu của bạn với bất kỳ ai.</p>
                    <h3 className="text-xl font-bold mb-3">Dữ liệu của bạn tồn tại bao lâu</h3>
                    <p className="mb-2">
                        Nếu bạn để lại bình luận, bình luận và siêu dữ liệu của nó sẽ được giữ lại
                        vô thời hạn. Điều này là để chúng tôi có thể tự động nhận ra và chấp nhận
                        bất kỳ bình luận nào thay vì giữ chúng trong khu vực đợi kiểm duyệt. Đối
                        với người dùng đăng ký trên trang web của chúng tôi (nếu có), chúng tôi
                        cũng lưu trữ thông tin cá nhân mà họ cung cấp trong hồ sơ người dùng của
                        họ. Tất cả người dùng có thể xem, chỉnh sửa hoặc xóa thông tin cá nhân của
                        họ bất kỳ lúc nào (ngoại trừ họ không thể thay đổi tên người dùng của họ).
                        Quản trị viên trang web cũng có thể xem và chỉnh sửa thông tin đó.
                    </p>
                    <h3 className="text-xl font-bold mb-3">Các quyền nào của bạn với dữ liệu của mình</h3>
                    <p className="mb-2">
                        Nếu bạn có tài khoản trên trang web này hoặc đã để lại nhận xét, bạn có thể
                        yêu cầu nhận tệp xuất dữ liệu cá nhân mà chúng tôi lưu giữ về bạn, bao gồm
                        mọi dữ liệu bạn đã cung cấp cho chúng tôi. Bạn cũng có thể yêu cầu chúng
                        tôi xóa mọi dữ liệu cá nhân mà chúng tôi lưu giữ về bạn. Điều này không bao
                        gồm bất kỳ dữ liệu nào chúng tôi có nghĩa vụ giữ cho các mục đích hành
                        chính, pháp lý hoặc bảo mật.
                    </p>
                    <h3 className="text-xl font-bold mb-3">Các dữ liệu của bạn được gửi tới đâu</h3>
                    <p className="mb-2">
                        Các bình luận của khách (không phải là thành viên) có thể được kiểm tra
                        thông qua dịch vụ tự động phát hiện spam.
                    </p>
                </div>
            </WrapperLayout>
        </>
    );
};

export default PolicyPage;

//  ----

PolicyPage.getLayput = (page: ReactNode) => {
    return <MainLayout>{page}</MainLayout>;
};
