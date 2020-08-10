import QR from "../../../assets/images/qr.png";
import Link from "../../../assets/images/cod.png";

const setting = [
  {
    title: "Scan QR Code on this screen",
    icon: QR,
    PaymentLocation: "qrCode"
  },
  {
    title: "Send PayLink to my phone",
    icon: Link,
    PaymentLocation: "sendLink"
  },
];
export default setting;
