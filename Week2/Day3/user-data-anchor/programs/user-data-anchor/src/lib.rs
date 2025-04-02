use anchor_lang::prelude::*;

declare_id!("AKpNx23DuTPqYvVGG3weGashmBTifA2bEa6RUKQ4LKXV");

#[program]
mod user_data {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>, name: String, age: u8) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.authority = *ctx.accounts.authority.key;
        user.name = name;
        user.age = age;
        Ok(())
    }

    pub fn update_user(ctx: Context<UpdateUser>, name: String, age: u8) -> Result<()> {
        let user = &mut ctx.accounts.user;
        require!(user.authority == *ctx.accounts.authority.key, CustomError::Unauthorized);
        user.name = name;
        user.age = age;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 4 + 40)]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUser<'info> {
    #[account(mut, has_one = authority)]
    pub user: Account<'info, User>,
    pub authority: Signer<'info>,
}

#[account]
pub struct User {
    pub authority: Pubkey,
    pub name: String,
    pub age: u8,
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized action.")]
    Unauthorized,
}
