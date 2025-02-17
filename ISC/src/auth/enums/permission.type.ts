import CauseTransactions from "./transactions/cause.transaction";
import ComponentTransactions from "./transactions/component.transaction";
import DefectTransactions from "./transactions/defect.transaction";
import DeviceTransactions from "./transactions/device.transaction";
import LineTransactions from "./transactions/line.transaction";
import NoScheduledStopTransactions from "./transactions/no_scheduled-stop.transaction";
import ProductTransactions from "./transactions/product.transaction";
import ProfileTransactions from "./transactions/profile.transaction";
import ScheduledStopTransactions from "./transactions/scheduled-stop.transaction";
import ShiftTransactions from "./transactions/shift.transaction";
import SolutionTransactions from "./transactions/solution.transaction";
import SupplierTransactions from "./transactions/supplier.transaction";
import UserTransactions from "./transactions/user.transaction";

const Permission = {
    User: UserTransactions,
    Profile: ProfileTransactions,
    Shift: ShiftTransactions,
    Cause: CauseTransactions,
    Defect: DefectTransactions,
    Solution: SolutionTransactions,
    Supplier: SupplierTransactions,
    Component: ComponentTransactions,
    Product: ProductTransactions,
    ScheduleStop: ScheduledStopTransactions,
    Device:DeviceTransactions,
    NoScheduledStop:NoScheduledStopTransactions,
    Line: LineTransactions

}

export default Permission;