import {IPrePluginInterface, IResultPayload, ISyncanoContext} from 'syncano-middleware';
import {validate} from 'syncano-validate';
const rules = {
  a: 'required',
};
class ValidatePlugin implements IPrePluginInterface {
  public async preProcess(val: ISyncanoContext, pluginOpts: object): Promise<IResultPayload> {
    return validate(val.args, rules);
  }
}
