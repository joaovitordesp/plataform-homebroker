import Account from "../../domain/Account";
import AccountRepository from "../../infra/repository/AccountRepository";
import crypto from "crypto";

export default class Signup {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(input: any): Promise<any> {
    const accountId = crypto.randomUUID();
    const account = Account.create(
      input.name,
      input.email,
      input.document,
      input.password
    );

    await this.accountRepository.saveAccount(account);
    return {
      accountId,
    };
  }
}
